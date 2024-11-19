import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyle } from "../../assets/css/globalStyle"
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export default function TermsAndConditions({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...globalStyle.alignItemsCenter, gap: 15 }}>
          <FontAwesome name="angle-left" size={28} color="white" />
          <Text style={{ color: "#FFF", fontSize: 24 }}>
            Terms and conditions
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#040B11",
      },
      headerTintColor: "#FFF",
    });
  }, [navigation]);
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={[styles.title]}>
        Financial Advice Warning
      </Text>
      <View>
        <Text style={styles.caption}>
          The information provided by Capiwise through its website and/or mobile
          application (Platforms) is either factual information or general
          advice. It is based upon the results of our analysis model. Capiwise
          GmbH (Registergericht: Amtsgericht Charlottenburg, UVZ-Nrn.
          468+469/2023), is a registered investment advisor
          (Vermögensanlageberater) with the German Federal Financial Supervisory
          Authority (Bundesanstalt für Finanzdienstleistungsaufsicht, BaFin).
          Any advice contained in this website is general advice only and has
          been prepared without considering your objectives, financial situation
          or needs. You should not rely on any advice and/or information
          contained in this website and before making any investment decision,
          we recommend that you consider whether it is appropriate for your
          situation and seek appropriate financial, taxation and legal advice .
          Please read our Investment Services Agreement
          (Vermögensanlagen-Informationsblatt) before deciding whether to obtain
          investment services from us. Please read our Investment Services
          Agreement to learn more.
        </Text>
      </View>
      <Text style={[styles.title]}>
        Account Creation
      </Text>
      <Text style={[styles.caption]}>
        To create an account, you must be:{"\n"} &nbsp; • &paddingLeft: 10,nbsp;at least 10
        years of age;{"\n"}
        &nbsp;&nbsp;&nbsp;• possess the legal right and ability to enter into a
        legally binding
        agreement with us; {"\n"}
        &nbsp;&nbsp;&nbsp;• agree and warrant to use these Platforms in
        accordance with these Terms;{"\n"}
        We retain the right to cancel your account for any reason or refuse your
        account creation request.
      </Text>
      <Text style={[styles.title]}>
        Collection Notice
      </Text>
      <Text style={[styles.caption]}>
        We collect personal information about you in order to provide our
        services and for purposes otherwise set out in our Privacy Policy. That
        document should be read in conjunction with this document.
      </Text>
      <Text style={[styles.title]}>
        Collection Notice
      </Text>
      <Text style={[styles.caption]}>
        The information on our Platforms is not comprehensive and is intended to
        provide a summary of the subject matter covered. While we use all
        reasonable attempts to ensure the accuracy and completeness of the data
        and information on our Platforms, to the extent permitted by law,
        including the German Civil Code, we make no warranty regarding the
        information on these Platforms. You should monitor any changes to the
        information contained on these Platforms.{"\n"}Furthermore, we make no
        commitments regarding the minimum amount of uptime that our platforms
        will maintain, although we will make every reasonable attempt to ensure
        that the platforms are operational.{"\n"}We are not liable to you or
        anyone else if interference with or damage to your computer systems
        occurs in connection with the use of these Platforms or a linked
        website. You must take your own precautions to ensure that whatever you
        select for your use from our Platforms is free of viruses or anything
        else (such as worms or Trojan horses) that may interfere with or damage
        the operations of your computer systems.{"\n"}We may, from time to time
        and without notice, change or add to the Platforms (including the Terms)
        or the information, products or services described in it. However, we do
        not undertake to keep the Platforms updated. We are not liable to you or
        anyone else if errors occur in the information or the Platforms are not
        up-to-date.
      </Text>
      <Text style={[styles.title]}>
        Promotions and Competitions
      </Text>
      <Text style={[styles.caption]}>
        For certain campaigns, promotions or contests, additional terms and
        conditions may apply. If you want to participate in such a campaign,
        promotion or contest, you need to agree to the relevant terms and
        conditions applicable to that campaign, promotion or contest. In case of
        any inconsistency between such terms and conditions and these Terms,
        those terms and conditions will prevail.
      </Text>
      <Text style={[styles.title]}>
        Governing Law and Jurisdiction
      </Text>
      <Text style={[styles.caption]}>
        These Terms and Conditions shall be governed by and construed in
        accordance with the laws of Germany. Any dispute arising out of or in
        connection with these Terms and Conditions, including any question
        regarding its existence, validity or termination, shall be subject to
        the exclusive jurisdiction of the courts of Berlin, Germany.
      </Text>
      <Text style={[styles.title]}>
        Trials
      </Text>
      <Text style={[styles.caption]}>
        Users are able to purchase premium services from Capiwise. These
        services can be delivered via subscription or one-off payments. We
        reserve the right to cancel or refuse access to our premium services for
        any user. The following terms apply to those users that have purchased
        said premium features.{" "}
      </Text>
      <Text style={[styles.title]}>
        Purchases
      </Text>
      <Text style={[styles.caption]}>
        Users are able to purchase premium services from Capiwise. These
        services can be delivered via subscription or one-off payments. We
        reserve the right to cancel or refuse access to our premium services for
        any user. The following terms apply to those users that have purchased
        said premium features.
      </Text>
      <Text style={[styles.title]}>
        Discounts/Promotional Prices
      </Text>
      <Text style={[styles.caption]}>
        Users that subscribe under a reduced rate shall have the discount
        applied for that period only (i.e. as advised on the offer, up to a
        maximum of 12 months). After which time, their rate shall revert to
        standard pricing at that date.
      </Text>
      <Text style={[styles.title]}>
        Changes in price
      </Text>
      <Text style={[styles.caption]}>
        Capiwise reserves the right to change our pricing at any time, and with
        reasonable notice to our subscribers. At the end of the notice period,
        the user’s next billing period (i.e. monthly or annually) payment shall
        be at the revised price.{" "}
      </Text>
      <Text style={[styles.title]}>
        Payment methods and security
      </Text>
      <Text style={[styles.caption]}>
        Payments are via credit card and are handled by a third-party payment
        service called Stripe. Credit card details are not stored on Capiwise’s
        systems.{" "}
      </Text>
      <Text style={[styles.title]}>
        Cancellation
      </Text>
      <Text style={[styles.caption]}>
        Users can cancel their subscription at any time. Users shall not be
        entitled to a partial refund; however, at our sole discretion, we may
        choose to give users a partial refund.{" "}
      </Text>
      <Text style={[styles.title]}>
        Refunds
      </Text>
      <Text style={[styles.caption]}>
        We offer a 14-day money-back guarantee for all new subscribers from
        their sign-up date. Past the 14-day period, refunds shall be at our sole
        discretion.{" "}
      </Text>
      <Text style={[styles.title]}>
        Subscription fees
      </Text>
      <Text style={[styles.caption]}>
        If applicable, users authorize Capiwise to automatically debit their
        credit card on their initial registration and then on each subsequent
        anniversary of their billing cycle (i.e. monthly or annually), until
        canceled.{" "}
      </Text>
      <Text style={[styles.title]}>
        Sole use only
      </Text>
      <Text style={[styles.caption]}>
        Users are unable to share access to their premium features unless
        explicitly approved under their subscription level.{" "}
      </Text>
      <Text style={[styles.title]}>
        German Users
      </Text>
      <Text style={[styles.caption]}>
        Fees charged to German users are subject to VAT.
      </Text>
      <Text style={[styles.title]}>
        Linked sites
      </Text>
      <Text style={[styles.caption]}>
        Our Platform may contain links to websites operated by third parties.
        Those links are provided for convenience and may not remain current or
        be maintained. Unless expressly stated otherwise, we do not endorse and
        are not responsible for the content on those linked websites and have no
        control over or rights in those linked websites.{" "}
      </Text>
      <Text style={[styles.title]}>
        Intellectual property rights
      </Text>
      <Text style={[styles.caption]}>
        Unless otherwise indicated, we own or license from third parties all
        rights, title and interest (including copyright, designs, patents,
        trademarks, and other intellectual property rights) in these Platforms
        and in all of the material (including all text, graphics, logos, audio,
        and software) made available on these Platforms (Content). Your use of
        these Platforms and use of and access to any Content does not grant or
        transfer any rights, title, or interest to you in relation to these
        Platforms or the Content. However, we do grant you a license to access
        these Platforms and view the Content on the terms and conditions set out
        in this Agreement and, where applicable, as expressly authorized by us
        and/or our third-party licensors. Outside of the affiliate or
        partnership program, social sharing buttons, infographic download
        feature, PDF download feature (only available with selected subscription
        levels) or with written permission any reproduction or redistribution of
        these Platforms or the Content is prohibited and may result in civil.{" "}
      </Text>
      <Text style={[styles.title]}>
        No Commercial Use
      </Text>
      <Text style={[styles.caption]}>
        Except for the affiliate/partnership programs and professional
        membership levels, the Platforms are for your personal, non-commercial
        use only. You may not modify, copy, distribute, transmit, display,
        perform, reproduce, publish, license, commercially exploit, create
        derivative works from, transfer, or sell any content, software,
        products, or services contained within the Platforms. You may not use
        the Platforms, or any of its content, to further any commercial purpose,
        including any advertising or advertising revenue generation activity on
        your own website.{" "}
      </Text>
      <Text style={[styles.title]}>
        Unacceptable Activity
      </Text>
      <Text style={[styles.caption]}>
        You must not do any act that we would deem to be inappropriate,
        unlawful, or prohibited by any laws applicable to these Platforms,
        including but not limited to:{"\n"}&nbsp;&nbsp;• &nbsp;any act that
        would constitute a breach of either the privacy (including
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;uploading private or personal
        information without an individual consent)
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;or any other of the legal rights of
        individuals;{"\n"}&nbsp;&nbsp;• using these Platforms to defame or libel
        us, our employees, or other &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;individuals;
        {"\n"}&nbsp;&nbsp;• uploading files that contain viruses that may cause
        damage to our &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;property or the
        property of other individuals;{"\n"}&nbsp;&nbsp;• posting or
        transmitting to these Platforms any non-authorized material,
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;including but not limited to material that
        is, in our opinion, likely to &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cause
        &nbsp;annoyance or which is defamatory, racist, obscene, threatening,
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pornographic, or otherwise or which is
        detrimental to or in violation of our
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;systems or a third systems or network
        security;{"\n"}
        You must not do any act that we would deem to be inappropriate,
        unlawful, or prohibited by any laws applicable to these Platforms,
        including but not limited to:
      </Text>
      <Text style={[styles.title]}>
        Warranties and Disclaimers
      </Text>
      <Text style={[styles.caption]}>
        To the maximum extent permitted by law, we make no warranties or
        representations about the Platforms or the content, including but not
        limited to warranties or representations that they will be complete,
        accurate, or up-to-date, that access will be uninterrupted or error-free
        or free from viruses, or that the Platforms will be secure. We reserve
        the right to restrict, suspend, or terminate without notice your access
        to the Platforms, any content, or any feature of the Platforms at any
        time without notice, and we will not be responsible for any loss, cost,
        damage, or liability that may arise as a result.
      </Text>
      <Text style={[styles.title]}>
        Liability
      </Text>
      <Text style={[styles.caption]}>
        To the maximum extent permitted by law, in no event shall we be liable
        for any direct and indirect loss, damage, or expense – irrespective of
        the manner in which it occurs – which may be suffered due to your use of
        our Platforms and/or the information or materials contained on it, or as
        a result of the inaccessibility of these Platforms and/or the fact that
        certain information or materials contained on it are incorrect,
        incomplete, or not up-to-date.{" "}
      </Text>

      <Text style={[styles.title]}>
        Cookies
      </Text>
      <Text style={[styles.caption]}>
        These Platforms use cookies. If you do not have cookies enabled in your
        web browser, some functions of the site may not work as intended.
      </Text>
      <Text style={[styles.title]}>
        Jurisdiction and Governing Law
      </Text>
      <Text style={[styles.caption]}>
        Your use of these Platforms and these Terms are governed by the law of
        Germany and you submit to the non-exclusive jurisdiction of the courts
        exercising jurisdiction in Germany.
      </Text>
      <Text style={[styles.title]}>
        Special Conditions in relation to S&P Capital IQ{" "}
      </Text>
      <Text style={[styles.caption]}>
        S&P Capital IQ is the major data provider to Capiwise, which is provided
        under a license arrangement. For the purposes of this special condition,
        LICENSEE shall mean Capiwise, and S&P Services/S&P shall mean S&P
        Capital IQ. Furthermore: {"\n"}
        A){"\n"}
        &nbsp;&nbsp;• &nbsp;"Licensee Customer" shall mean an entity that is a
        customer of LICENSEE and (a) provides access to the S&P Service(s) to
        its employees only for their internal use for business purposes; and (b)
        can access any of the S&P Service(s) only via a password/user ID issued
        by LICENSEE.{"\n"} &nbsp;• &nbsp;"End User" shall mean an individual
        that is a customer of LICENSEE and (a) whose use of the S&P Service(s)
        shall be solely for his/her personal non-commercial use; and (b) who can
        access any of the S&P Service(s) only via a password/user ID issued by
        LICENSEE.{"\n"}
        B){"\n"}S&P Service(s) agrees that:{"\n"}&nbsp;&nbsp;• &nbsp;Neither
        LICENSEE, S&P, their affiliates nor any third-party licensor shall have
        any liability for the accuracy or completeness of the information or
        software furnished through the Licensee Service, or for delays,
        interruptions or omissions therein nor for any lost profits, indirect,
        special or consequential damages.{"\n"} &nbsp;• &nbsp;Either LICENSEE,
        S&P, their affiliates or third-party licensors have exclusive
        proprietary rights in any information and software received. Subscriber
        shall not use or permit anyone to use the information or software
        provided through the Licensee Service for any unlawful or unauthorized
        purpose.
        {"\n"}&nbsp;• &nbsp;Subscriber shall not use or permit anyone to use the
        information or software provided through the Licensee Service for any
        unlawful or unauthorized purpose.
        {"\n"}&nbsp;• &nbsp;Subscriber is not authorized or permitted to furnish
        such information or software to any person or firm for reuse or
        retransmission without prior written approval of the source of such
        information or software.
        {"\n"}&nbsp;• &nbsp;Access to the S&P Service(s) is subject to
        termination in the event that any agreement between LICENSEE and a
        provider of information or software distributed through the Licensee
        Service is terminated in accordance with its terms.
        {"\n"}&nbsp;• &nbsp;The use of the S&P Service(s) by End Users and
        Licensee Customers shall be in compliance with Section A(i-ii) above.
      </Text>
      <Text style={[styles.title]}>
        Governing Law
      </Text>
      <Text style={[styles.caption]}>
        These special conditions shall be governed by and construed in
        accordance with the laws of Germany, and any disputes arising from or in
        connection with these special conditions shall be subject to the
        exclusive jurisdiction of the courts of Germany.
      </Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#040B11",
    paddingHorizontal: 15,
  },
  caption: {
    textAlign: "justify",
    fontSize: 10,
    fontWeight: "400",
    marginBottom: 20,
    color: "#FFF",
    width: "100%",
  },
  title: {
    textAlign: "justify",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#FFF",
    width: "100%",
  }
});
